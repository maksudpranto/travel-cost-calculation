"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AgentModeContextType {
    isAgentMode: boolean;
    setAgentMode: (enabled: boolean) => void;
    toggleAgentMode: () => void;
}

const AgentModeContext = createContext<AgentModeContextType | undefined>(undefined);

export function AgentModeProvider({ children }: { children: React.ReactNode }) {
    const [isAgentMode, setIsAgentMode] = useState<boolean>(false);

    const setAgentMode = (enabled: boolean) => setIsAgentMode(enabled);
    const toggleAgentMode = () => setIsAgentMode(prev => !prev);

    return (
        <AgentModeContext.Provider value={{ isAgentMode, setAgentMode, toggleAgentMode }}>
            {children}
        </AgentModeContext.Provider>
    );
}

export function useAgentMode() {
    const context = useContext(AgentModeContext);
    if (context === undefined) {
        throw new Error('useAgentMode must be used within an AgentModeProvider');
    }
    return context;
}
