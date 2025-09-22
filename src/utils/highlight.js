import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import elixir from 'highlight.js/lib/languages/elixir';
import django from 'highlight.js/lib/languages/django';
import php from 'highlight.js/lib/languages/php';
import 'highlight.js/styles/github-dark.css';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('elixir', elixir);
hljs.registerLanguage('django', django);
hljs.registerLanguage('php', php);

// Helper function to highlight a single element
const highlightElement = (el, binding) => {
  // The directive is on the <pre> tag, but highlight.js needs to act on the <code> tag
  const codeEl = el.querySelector('code');
  if (!codeEl) return;

  const language = binding.value;
  if (language) {
    // Set the class for language detection
    codeEl.className = `hljs language-${language}`;
  } else {
    // If no language is provided, clear class for auto-detection
    codeEl.className = 'hljs';
  }

  // Apply highlighting to the <code> element
  hljs.highlightElement(codeEl);
};

// Vue directive for highlighting
export const highlightDirective = {
  mounted(el, binding) {
    highlightElement(el, binding);
  },
  updated(el, binding) {
    // Re-highlight when the component updates (e.g., snippet content changes)
    highlightElement(el, binding);
  }
};

// Global registration
export default {
  install: (app) => {
    app.directive('highlight', highlightDirective);
    // No need to expose a global highlight function anymore
    app.config.globalProperties.$hljs = hljs;
  }
};
