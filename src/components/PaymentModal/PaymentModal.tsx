import React, { useState } from 'react';
import '../../styles/global.css';

interface PaymentModalProps {
    amount: number;
    onPaymentSuccess: () => void;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ amount, onPaymentSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Basic formatting simulating input masking
        let formattedValue = value;
        if (name === 'cardNumber') {
            formattedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
        }

        if (name === 'expiry') {
            // Remove non digits
            const clean = value.replace(/\D/g, '');
            // Limit to 4 digits (MMYY)
            const limited = clean.slice(0, 4);

            if (limited.length >= 3) {
                // If we have MMY or MMYY, insert slash
                formattedValue = limited.slice(0, 2) + '/' + limited.slice(2);
            } else {
                formattedValue = limited;
            }
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onPaymentSuccess();
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="glass" style={{
                padding: '2.5rem',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '450px',
                color: 'white',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: '#fff', fontSize: '1.5rem' }}>Güvenli Ödeme</h2>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>🔒 256-bit SSL</div>
                </div>

                {/* Card Visual */}
                <div style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '2rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem', letterSpacing: '2px' }}>
                        {formData.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', opacity: 0.9 }}>
                        <div>
                            <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase' }}>Kart Sahibi</div>
                            <div>{formData.cardName || 'AD SOYAD'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.6rem', opacity: 0.7, textTransform: 'uppercase' }}>SKT</div>
                            <div>{formData.expiry || 'AA/YY'}</div>
                        </div>
                    </div>
                </div>

                <p style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1rem' }}>
                    Toplam Tutar: <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '1.2rem' }}>{amount},00 TL</span>
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        autoFocus
                        required type="text" name="cardName" placeholder="Kart Üzerindeki İsim"
                        value={formData.cardName} onChange={handleInputChange}
                        style={inputStyle}
                    />
                    <input
                        required type="text" name="cardNumber" placeholder="Kart Numarası"
                        value={formData.cardNumber} onChange={handleInputChange}
                        style={inputStyle}
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            required type="text" name="expiry" placeholder="AA/YY" maxLength={5}
                            value={formData.expiry} onChange={handleInputChange}
                            style={{ ...inputStyle, flex: 1 }}
                        />
                        <input
                            required type="text" name="cvv" placeholder="CVV" maxLength={3}
                            value={formData.cvv} onChange={handleInputChange}
                            style={{ ...inputStyle, width: '100px' }}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? 'Ödeme İşleniyor...' : `Ödemeyi Tamamla (${amount} TL)`}
                    </button>
                </form>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.2)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none'
};

const buttonStyle = {
    marginTop: '1rem',
    padding: '16px',
    borderRadius: '12px',
    background: 'white',
    color: 'black',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'transform 0.1s'
};

export default PaymentModal;
