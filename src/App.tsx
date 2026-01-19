import confetti from 'canvas-confetti';
import { playSuccessSound } from './utils/sound';
import { useState } from 'react';
import Calculator from './components/Calculator/Calculator';
import PaymentModal from './components/PaymentModal/PaymentModal';
import './styles/global.css';

function App() {
    const [showPayment, setShowPayment] = useState(false);
    const [pendingResult, setPendingResult] = useState('');
    const [displayResult, setDisplayResult] = useState<string | null>(null);

    const handleRequestPayment = (result: string) => {
        setPendingResult(result);
        setDisplayResult(null); // Reset result so that if the new result is same as old, the change still triggers
        setShowPayment(true);
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setDisplayResult(pendingResult);

        // Trigger Polish
        playSuccessSound();
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#bb86fc', '#d946ef', '#ffffff'] // Premium colors
        });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: '800',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                cursor: 'default'
            }}>
                Expensive Calculator
            </h1>

            {/* Pass result via overrideDisplay to show it on the screen */}
            <Calculator
                onRequestPayment={handleRequestPayment}
                disabled={showPayment}
                overrideDisplay={displayResult}
            />

            {showPayment && (
                <PaymentModal
                    amount={100}
                    onPaymentSuccess={handlePaymentSuccess}
                    onClose={() => setShowPayment(false)}
                />
            )}
        </div>
    );
}

export default App;
