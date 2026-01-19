import React, { useState, useEffect } from 'react';
import '../../styles/global.css';
import { playClickSound } from '../../utils/sound';

interface CalculatorProps {
    onRequestPayment: (result: string) => void;
    disabled?: boolean;
    overrideDisplay?: string | null;
}

const Calculator: React.FC<CalculatorProps> = ({ onRequestPayment, disabled = false, overrideDisplay = null }) => {
    const [display, setDisplay] = useState('0');
    const [expression, setExpression] = useState('');
    const [pendingOp, setPendingOp] = useState(false);

    // Effect to handle external display updates (e.g. showing result after payment)
    useEffect(() => {
        if (overrideDisplay) {
            setDisplay(overrideDisplay);
            setExpression(''); // Clear expression on new result
            setPendingOp(false);
        }
    }, [overrideDisplay]);

    const handleNumber = (num: string) => {
        if (disabled) return;
        playClickSound();

        // Prevent overflow: limit display length
        if (display.length > 12 && !pendingOp) return;

        if (pendingOp || display === '0' || display === 'PAY ME') {
            setDisplay(num);
            setPendingOp(false);
        } else {
            setDisplay(display + num);
        }
        setExpression(prev => prev + num);
    };

    const handleOperator = (op: string) => {
        if (disabled) return;
        playClickSound();
        setPendingOp(true);
        setExpression(prev => prev + ` ${op} `);
        setDisplay(op);
    };

    const handleClear = () => {
        if (disabled) return;
        playClickSound();
        setDisplay('0');
        setExpression('');
    };

    const handleEqual = () => {
        if (disabled) return;
        playClickSound();
        try {
            // Basic evaluation - in a real app, use a safer parser
            // eslint-disable-next-line
            const result = new Function('return ' + expression)();

            // CRITICAL: Do NOT setDisplay(result) here.
            // Instead, just clear or keep the expression, and ask for payment.
            onRequestPayment(String(result));
            // Show a placeholder or reset
            setDisplay('PAY ME');
            // setExpression(''); // Optionally keep expression
        } catch {
            setDisplay('Error');
            setExpression('');
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (disabled) return;

            const { key } = e;
            if (/[0-9]/.test(key)) handleNumber(key);
            if (['+', '-', '*', '/'].includes(key)) handleOperator(key);
            if (key === 'Enter') handleEqual();
            if (key === 'Backspace') {
                setDisplay(prev => prev.slice(0, -1) || '0');
                setExpression(prev => prev.slice(0, -1));
            }
            if (key === 'Escape') handleClear();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, expression, disabled]); // Dependencies for closure state access

    const buttons = [
        { label: 'C', type: 'action', onClick: handleClear },
        { label: '(', type: 'func', onClick: () => handleOperator('(') }, // Simplify for demo
        { label: ')', type: 'func', onClick: () => handleOperator(')') },
        { label: '/', type: 'op', onClick: () => handleOperator('/') },
        { label: '7', type: 'num', onClick: () => handleNumber('7') },
        { label: '8', type: 'num', onClick: () => handleNumber('8') },
        { label: '9', type: 'num', onClick: () => handleNumber('9') },
        { label: '*', type: 'op', onClick: () => handleOperator('*') },
        { label: '4', type: 'num', onClick: () => handleNumber('4') },
        { label: '5', type: 'num', onClick: () => handleNumber('5') },
        { label: '6', type: 'num', onClick: () => handleNumber('6') },
        { label: '-', type: 'op', onClick: () => handleOperator('-') },
        { label: '1', type: 'num', onClick: () => handleNumber('1') },
        { label: '2', type: 'num', onClick: () => handleNumber('2') },
        { label: '3', type: 'num', onClick: () => handleNumber('3') },
        { label: '+', type: 'op', onClick: () => handleOperator('+') },
        { label: '0', type: 'num', onClick: () => handleNumber('0'), wide: true },
        { label: '.', type: 'num', onClick: () => handleNumber('.') },
        { label: '=', type: 'eq', onClick: handleEqual },
    ];

    return (
        <div className="glass" style={{
            width: '320px',
            borderRadius: '30px',
            padding: '25px', // Increased padding to prevent overflow
            paddingBottom: '30px', // Extra bottom padding for safety
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            userSelect: 'none', // Prevent selection of UI elements
            WebkitUserSelect: 'none'
        }}>
            <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'right',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                marginBottom: '10px',
                userSelect: 'text', // Allow selection of result
                WebkitUserSelect: 'text',
                cursor: 'text'
            }}>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', height: '20px' }}>{expression}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '500', color: 'white' }}>{display}</div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px'
            }}>
                {buttons.map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.onClick}
                        style={{
                            gridColumn: btn.wide ? 'span 2' : 'span 1',
                            // Only force aspect ratio for single buttons to keep them square.
                            // Wide buttons will just fill the height of the row (defined by square buttons).
                            aspectRatio: btn.wide ? 'auto' : '1/1',
                            // If it's the only button in a row (unlikely here) auto might collapse, 
                            // but since "0" shares a row with "." and "=", they will enact the height.
                            // Actually, simpler: "height: '100%'" is implied in grid stretch.
                            // Let's just unset aspect ratio for wide and set it for normal.

                            borderRadius: '20px',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            background: btn.type === 'eq' ? 'var(--accent-gradient)' :
                                btn.type === 'op' ? 'rgba(187, 134, 252, 0.2)' :
                                    btn.type === 'action' ? 'rgba(3, 218, 198, 0.2)' :
                                        'rgba(255,255,255,0.05)',
                            color: 'var(--text-color)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
