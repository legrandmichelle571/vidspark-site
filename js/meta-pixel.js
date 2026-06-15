/**
 * Meta (Facebook) Pixel — VidSpark AI
 * ID : 900501919732279
 * Inclus sur toutes les pages publiques. Suit les PageView automatiquement.
 * Les événements de conversion (CompleteRegistration, Purchase) sont
 * déclenchés par les pages concernées (dashboard, success).
 */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '900501919732279');
fbq('track', 'PageView');
