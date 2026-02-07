'use client';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

interface MathTextProps {
    content: string;
    block?: boolean;
}

export default function MathText({ content, block = false }: MathTextProps) {
    // Pre-process to ensure common delimiters are handled if the library is picky
    // react-latex-next handles $ and $$ by default. 
    // We'll trust it handles \( \) too, or we can map them.
    // Documentation says it follows KaTeX auto-render options.

    return (
        <span className={`math-text ${block ? 'block my-4' : ''}`}>
            <Latex>{content}</Latex>
        </span>
    );
}
