import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface TrackingConfig {
  ga4_id?: string
  gtm_id?: string
  fb_pixel_id?: string
  custom_head_scripts?: string
}

let loaded = false

export default function useAnalytics() {
  useEffect(() => {
    if (loaded) return
    loaded = true

    supabase
      .from('site_settings')
      .select('key, value')
      .eq('key', 'tracking')
      .single()
      .then(({ data }) => {
        if (!data?.value) return
        const config = data.value as TrackingConfig

        // Google Analytics 4
        if (config.ga4_id) {
          const script = document.createElement('script')
          script.async = true
          script.src = `https://www.googletagmanager.com/gtag/js?id=${config.ga4_id}`
          document.head.appendChild(script)

          const inline = document.createElement('script')
          inline.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${config.ga4_id}');
          `
          document.head.appendChild(inline)
        }

        // Google Tag Manager
        if (config.gtm_id) {
          const gtmScript = document.createElement('script')
          gtmScript.textContent = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${config.gtm_id}');
          `
          document.head.appendChild(gtmScript)

          // GTM noscript iframe (append to body)
          const noscript = document.createElement('noscript')
          const iframe = document.createElement('iframe')
          iframe.src = `https://www.googletagmanager.com/ns.html?id=${config.gtm_id}`
          iframe.height = '0'
          iframe.width = '0'
          iframe.style.display = 'none'
          iframe.style.visibility = 'hidden'
          noscript.appendChild(iframe)
          document.body.prepend(noscript)
        }

        // Facebook Pixel
        if (config.fb_pixel_id) {
          const fbScript = document.createElement('script')
          fbScript.textContent = `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${config.fb_pixel_id}');
            fbq('track', 'PageView');
          `
          document.head.appendChild(fbScript)
        }

        // Custom head scripts
        if (config.custom_head_scripts) {
          const container = document.createElement('div')
          container.innerHTML = config.custom_head_scripts
          Array.from(container.children).forEach(child => {
            document.head.appendChild(child.cloneNode(true))
          })
        }
      })
  }, [])
}
