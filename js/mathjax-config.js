window.MathJax = {
  config: 'TeX-AMS_HTML-full',
  tex2jax: {
    //inlineMath: [ ["\\(","\\)"] ],
    inlineMath: [ ['$','$'], ["\\(","\\)"] ],
    displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
    processEscapes: true
  },
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  },
  svg: {
    fontCache: 'global'
  }
};
