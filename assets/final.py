import re
import os


def replace_custom_spans(text):
    """
    Converts [span_X](start_span)...[span_X](end_span)
    into <span id="span_X">...</span>
    """
    pattern = re.compile(r'\[span_(\d+)\]\(start_span\)(.*?)\[span_\1\]\(end_span\)', re.DOTALL)
    replaced = re.sub(pattern, r'<span id="span_\1">\2</span>', text)
    return replaced

def clean_latex_math(text):
    """
    Convert LaTeX math formulas ($...$) into HTML-friendly equivalents.
    Handles Greek letters, math operators, superscripts, subscripts,
    nested fractions, square roots, vectors, bars, hats, overlines, etc.
    """
    def replace_math(match):
        formula = match.group(1)

        # --- Basic replacements ---
        replacements = {
				    # Greek letters & common math symbols
				    r'\alpha': 'α', r'\beta': 'β', r'\gamma': 'γ', r'\delta': 'δ',
				    r'\epsilon': 'ε', r'\zeta': 'ζ', r'\eta': 'η', r'\theta': 'θ',
				    r'\iota': 'ι', r'\kappa': 'κ', r'\lambda': 'λ', r'\mu': 'μ',
				    r'\nu': 'ν', r'\xi': 'ξ', r'\omicron': 'ο', r'\pi': 'π',
				    r'\rho': 'ρ', r'\sigma': 'σ', r'\tau': 'τ', r'\upsilon': 'υ',
				    r'\phi': 'φ', r'\chi': 'χ', r'\psi': 'ψ', r'\omega': 'ω',
				    r'\Gamma': 'Γ', r'\Delta': 'Δ', r'\Theta': 'Θ', r'\Lambda': 'Λ',
				    r'\Xi': 'Ξ', r'\Pi': 'Π', r'\Sigma': 'Σ', r'\Phi': 'Φ',
				    r'\Psi': 'Ψ', r'\Omega': 'Ω',
				
				    # Charges & special chemistry symbols
				    #r'Na^+': 'Na⁺', r'K^+': 'K⁺', r'Ca^2+': 'Ca²⁺', r'Mg^2+': 'Mg²⁺',
				    #r'Cl^-': 'Cl⁻', r'Br^-': 'Br⁻', r'I^-': 'I⁻', r'OH^-': 'OH⁻',
				    #r'H^+': 'H⁺', r'X^{\delta^-}': 'X^{δ⁻}', r'\delta^+': 'δ⁺',
				    #r'\delta^-': 'δ⁻', r'\sigma^*': 'σ*', r'E^\circ': 'E°', r'\circ': '°',
				
				    # Dots / ellipses
				    r'\ldots': '…', r'\cdots': '⋯', r'\vdots': '⋮', r'\ddots': '⋱',
				    r'\therefore': '∴', r'\because': '∵', r'\circ': '°',
				
				    # Basic math symbols
				    r'\pm': '±', r'\mp': '∓', r'\times': '×', r'\div': '÷', r'\cdot': '·',
				    r'\infty': '∞', r'\approx': '≈', r'\neq': '≠', r'\left(': '(', r'\right)': ')', r'\le': '≤', r'\ge': '≥',
				    r'\equiv': '≡',
				
				    # Arrows
				    r'\rightarrow': '→', r'\leftarrow': '←', r'\Rightarrow': '⇒',
				    r'\Leftarrow': '⇐', r'\leftrightarrow': '↔', r'\Leftrightarrow': '⇔',
				    r'\uparrow': '↑', r'\downarrow': '↓', r'\Uparrow': '⇑', r'\Downarrow': '⇓',
				    r'\mapsto': '↦',
				
				    # Functions
				    r'\sin': 'sin', r'\cos': 'cos', r'\tan': 'tan', r'\log': 'log',
				    r'\ln': 'ln', r'\exp': 'exp', r'\lim': 'lim', r'\max': 'max',
				    r'\min': 'min', r'\det': 'det', r'\nabla': '∇', r'\partial': '∂',
				
				    # Calculus / Algebra
				    r'\sum': '∑', r'\prod': '∏', r'\int': '∫', r'\iint': '∬',
				    r'\iiint': '∭', r'\oint': '∮', r'\prime': '′', r'\prime\prime': '″',
				
				    # Set symbols
				    r'\emptyset': '∅', r'\cup': '∪', r'\cap': '∩', r'\subset': '⊂',
				    r'\subseteq': '⊆', r'\nsubset': '⊄', r'\in': '∈', r'\notin': '∉',
				    r'\mathbb{N}': 'ℕ', r'\mathbb{Z}': 'ℤ', r'\mathbb{R}': 'ℝ',
				    r'\mathbb{Q}': 'ℚ', r'\mathbb{C}': 'ℂ',
				
				    # Logic
				    r'\neg': '¬', r'\wedge': '∧', r'\vee': '∨', r'\implies': '⇒',
				    r'\iff': '⇔', r'\forall': '∀', r'\exists': '∃',
				
				    # Advanced symbols
				    r'\otimes': '⊗', r'\oplus': '⊕', r'\perp': '⊥', r'\parallel': '‖',
				    r'\star': '★', r'\diamond': '♢', r'\dashv': '⊣', r'\vdash': '⊢',
				}
        for k, v in replacements.items():
            formula = formula.replace(k, v)

        # Remove \text{} but keep content
        formula = re.sub(r'\\text\{(.*?)\}', r'\1', formula)

        # Remove \left and \right
        formula = formula.replace(r'\left', '').replace(r'\right', '')

        # --- Superscripts and subscripts ---
        formula = re.sub(r'\^\{(.*?)\}', r'<sup>\1</sup>', formula)
        #formula = re.sub(r'\^([A-Za-z0-9α-ωΑ-Ω+\-])', r'<sup>\1</sup>', formula)
        #formula = re.sub(r'\^([^\s\^_{}]+)', r'<sup>\1</sup>', formula)
        formula = re.sub(r'\^([^\s^_{}])', r'<sup>\1</sup>', formula)
        formula = re.sub(r'_\{(.*?)\}', r'<sub>\1</sub>', formula)
        formula = re.sub(r'_(\w)', r'<sub>\1</sub>', formula)

        # --- Recursive fraction replacement ---
        def replace_frac_recursive(s):
            while '\\frac' in s:
                # Find \frac
                start = s.find('\\frac')
                # Find numerator
                brace_level = 0
                num_start = s.find('{', start) + 1
                i = num_start
                while i < len(s):
                    if s[i] == '{': brace_level += 1
                    elif s[i] == '}':
                        if brace_level == 0: break
                        brace_level -= 1
                    i += 1
                numerator = s[num_start:i]

                # Find denominator
                den_start = i + 2  # skip '}{'
                i = den_start
                brace_level = 0
                while i < len(s):
                    if s[i] == '{': brace_level += 1
                    elif s[i] == '}':
                        if brace_level == 0: break
                        brace_level -= 1
                    i += 1
                denominator = s[den_start:i]

                # Replace fraction
                s = s[:start] + f'({numerator}) / ({denominator})' + s[i+1:]
            return s

        formula = replace_frac_recursive(formula)

        # --- Square roots ---
        formula = re.sub(r'\\sqrt\{(.*?)\}', r'√(\1)', formula)

        # --- Hat, bar, vector, overline (LaTeX-accurate) ---
        def wrap_span_latex(m, comb=''):
            content = m.group(1)
            match = re.match(r'(.*?)(<sup>.*?</sup>|<sub>.*?</sub>)?$', content)
            base = match.group(1)
            rest = match.group(2) or ''
            return f'<span style="text-decoration:overline;">{base}</span>{comb}{rest}'

        formula = re.sub(r'\\hat\{(.*?)\}', lambda m: wrap_span_latex(m, '̂'), formula)
        formula = re.sub(r'\\bar\{(.*?)\}', lambda m: wrap_span_latex(m, '̄'), formula)
        formula = re.sub(r'\\vec\{(.*?)\}', lambda m: wrap_span_latex(m, '⃗'), formula)
        formula = re.sub(r'\\overline\{(.*?)\}', lambda m: wrap_span_latex(m), formula)

        # Clean extra spaces
        formula = re.sub(r'\s{2,}', ' ', formula.strip())
        return formula

    return re.sub(r'\$(.+?)\$', replace_math, text, flags=re.DOTALL)


# --- Process all HTML files ---
for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        #cleaned = replace_custom_spans(content)
        cleaned = clean_latex_math(replace_custom_spans(content))
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        print(f"✅ File cleaned: {filename}")
        #print(f"✅ Updated spans in: {filename}")