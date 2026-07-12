import React from 'react';

interface Props {
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  isConnecting?: boolean;
}

export default function ConnectWhatsAppButton({ onSuccess, onError, isConnecting }: Props) {
  const handleConnect = () => {
    if (typeof window === 'undefined' || !(window as any).FB) {
      onError('Facebook SDK not loaded. Please try again.');
      return;
    }

    (window as any).FB.login((response: any) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        sendTokenToBackend(accessToken);
      } else {
        onError('User cancelled login or did not fully authorize.');
      }
    }, {
      config_id: '1468136621307037', // Replace with the actual Config ID for Embedded Signup if available, else just use standard login
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        setup: {}
      }
    });
  };

  const sendTokenToBackend = async (token: string) => {
    try {
      const authToken = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/whatsapp/link`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ facebook_access_token: token })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect');
      
      onSuccess(data);
    } catch (error: any) {
      onError(error.message);
    }
  };

  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center w-full max-w-md"
    >
      {isConnecting ? 'Connecting...' : 'Connect WhatsApp Business'}
    </button>
  );
}
