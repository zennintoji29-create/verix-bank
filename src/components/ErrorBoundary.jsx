import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Verix Global ErrorBoundary Caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center font-sans selection:bg-[#00F0A0] selection:text-[#090C10]">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-xl">
            ⚠️
          </div>
          <h1 className="text-xl font-bold font-mono text-white mb-2">
            Verix Session Recovery
          </h1>
          <p className="text-xs text-[#8494A8] max-w-md mb-4 font-mono">
            {this.state.error?.message || 'An unexpected rendering error occurred. The system has safely halted.'}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                localStorage.removeItem('verix_bank_officer');
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-[#00F0A0] text-[#080B0F] text-xs font-mono font-bold hover:bg-[#00D68F] transition-all cursor-pointer shadow-md"
            >
              Reset Session &amp; Reload
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = window.location.pathname + '?portal=bank';
              }}
              className="px-4 py-2 rounded-xl bg-[#171E2B] text-white border border-white/[0.1] text-xs font-mono font-bold hover:bg-[#1F293A] transition-all cursor-pointer"
            >
              Go to Bank Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
