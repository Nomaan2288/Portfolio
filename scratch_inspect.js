const fs = require('fs');
const css = fs.readFileSync('assets/MainContainer-HGT2vxzP.css', 'utf8');

// Find all @media blocks containing landing-info
const mediaRegex = /@media[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*landing-info[^{}]*\}/g;
let m;
// Better: split by @media
const parts = css.split('@media');
parts.forEach((p, idx) => {
  if (p.includes('landing-info') || p.includes('what-box')) {
    console.log(`=== MEDIA PART ${idx} ===`);
    console.log(p.slice(0, 300));
  }
});
