/** @type {import('tailwindcss').Config} */
// Palette, type, radius, shadow, and the heartbeat keyframe are taken verbatim
// from couponlive-brand-tokens.md. Do not invent values here.
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: { 50:'#E9F9F0',100:'#C6F0D8',200:'#98E4B9',300:'#63D595',400:'#33C577',
                 500:'#13B25E',600:'#0F9C51',700:'#0D7E42',800:'#0B6335',900:'#084E2A' },
        navy:  { 50:'#F2F6F8',100:'#E1EAEF',200:'#C5D5DE',300:'#9EB5C2',400:'#688395',
                 500:'#425F73',600:'#2B4557',700:'#163140',800:'#08202E',900:'#00253C',950:'#001620' },
        blue:  { 50:'#E8F0FF',100:'#CBDDFF',200:'#9FC0FF',300:'#6B9BFF',400:'#3877FA',
                 500:'#0A5FF3',600:'#084ED0',700:'#0940A4',800:'#0A3576' },
        amber: { 50:'#FEF6E7',500:'#F5A524',800:'#9A6207' },
        red:   { 50:'#FEECEB',500:'#F04438',700:'#B42318' },
      },
      fontFamily: {
        display: ['"General Sans"','Poppins','system-ui','sans-serif'],
        sans:    ['Satoshi','Inter','system-ui','sans-serif'],
        mono:    ['"JetBrains Mono"','ui-monospace','monospace'],
      },
      borderRadius: { md:'10px', lg:'12px', xl:'16px', '2xl':'20px' },
      boxShadow: {
        sm:'0 1px 2px rgba(0,37,60,.06)',
        md:'0 4px 12px rgba(0,37,60,.08)',
        lg:'0 12px 32px rgba(0,37,60,.10)',
        focus:'0 0 0 3px rgba(19,178,94,.35)',
      },
      keyframes: {
        livePulse: { '0%,100%':{ boxShadow:'0 0 0 0 rgba(19,178,94,.45)' },
                     '50%':{ boxShadow:'0 0 0 6px rgba(19,178,94,0)' } },
        heartbeat: { '0%,100%':{ transform:'scale(1)' },
                     '20%':{ transform:'scale(1.18)' }, '40%':{ transform:'scale(.96)' } },
        shimmer: { '100%':{ transform:'translateX(100%)' } },
        popIn: { '0%':{ opacity:'0', transform:'scale(.96)' },
                 '100%':{ opacity:'1', transform:'scale(1)' } },
      },
      animation: {
        livePulse: 'livePulse 2s ease-in-out infinite',
        heartbeat: 'heartbeat 2s ease-in-out infinite',
        shimmer: 'shimmer 1.4s infinite',
        popIn: 'popIn 150ms ease-out',
      },
    },
  },
  plugins: [],
};
