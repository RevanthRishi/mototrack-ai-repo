import { useState, useCallback, useRef } from 'react';
import { DiagnosticResult, DiagnosticSeverity, DiagnosticRecommendation } from '@/lib/types';

export interface DiagnosticMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  result?: DiagnosticResult;
}

export interface UseAIDiagnosticReturn {
  messages: DiagnosticMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
}

function buildDiagnosticResult(
  content: string
): DiagnosticResult {
  // Parse structured fields from AI response
  const severityMatch = content.match(/severity:\s*(safe|caution|urgent|critical)/i);
  const recMatch = content.match(/recommendation:\s*(diy|professional|immediate)/i);
  const costMatch = content.match(/\$[\d,]+[\s–-]+\$?[\d,]+/g);

  return {
    symptoms: [],
    probableCauses: [],
    estimatedCost: {
      min: costMatch ? parseFloat(costMatch[0].replace(/[$,]/g, '').split(/[–-]/)[0]) : 0,
      max: costMatch ? parseFloat(costMatch[0].replace(/[$,]/g, '').split(/[–-]/).pop() || '0') : 0,
      currency: 'USD',
    },
    severity: (severityMatch?.[1]?.toLowerCase() as DiagnosticSeverity) || 'caution',
    recommendation: (recMatch?.[1]?.toLowerCase() as DiagnosticRecommendation) || 'professional',
    explanation: content,
  };
}

export function useAIDiagnostic(_vehicleId?: string | null): UseAIDiagnosticReturn {
  const [messages, setMessages] = useState<DiagnosticMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const msgIdRef = useRef(0);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: DiagnosticMessage = {
      id: `msg_${++msgIdRef.current}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      // Structured analysis based on symptom keywords
      const lower = text.toLowerCase();
      let response = '';

      // Basic keyword-based responses
      if (lower.includes('oil') || lower.includes('oil change')) {
        response = `**Oil Change Diagnostic**\n\nBased on your query about oil:\n\n**Typical Symptoms:** Dark oil, low oil warning, engine noise, metal particles in oil\n\n**Probable Causes:**\n- Normal oil degradation (every 3,000-5,000 km)\n- Oil leak from gasket or seal\n- Oil consumption between services\n\n**Estimated Cost:** $15–$80\n\n**Recommendation:** DIY\nChange oil yourself with proper tools (wrench set, oil drain pan, new oil filter). Use manufacturer-recommended grade.\n\n*severity: caution* | *recommendation: diy*`;
      } else if (lower.includes('brake') || lower.includes('braking')) {
        response = `**Brake System Diagnostic**\n\n**Probable Causes:**\n- Worn brake pads\n- Air in brake lines\n- Contaminated brake fluid\n- Worn rotor/disc\n\n**Estimated Cost:** $30–$300 (pads only) to $200–$600 (full system)\n\n**Recommendation:** Professional\nBrakes are critical safety components. If you're not experienced, have a mechanic inspect and service.\n\n*severity: urgent* | *recommendation: professional*`;
      } else if (lower.includes('chain') || lower.includes('sprocket')) {
        response = `**Chain & Drivetrain Diagnostic**\n\n**Probable Causes:**\n- Chain needs lubrication\n- Chain stretched beyond spec\n- Worn sprockets\n- Incorrect chain tension\n\n**Estimated Cost:** $10–$50 (chain oil) to $80–$250 (chain + sprocket replacement)\n\n**Recommendation:** DIY\nRegular chain maintenance is a core DIY skill. Check tension every 500km and lubricate every 1,000km.\n\n*severity: safe* | *recommendation: diy*`;
      } else if (lower.includes('tire') || lower.includes('tyre') || lower.includes('flat')) {
        response = `**Tire Diagnostic**\n\n**Probable Causes:**\n- Tire wear (normal aging)\n- Puncture from debris\n- Improper tire pressure\n- Damaged valve stem\n\n**Estimated Cost:** $20–$80 (patch) to $80–$400 (new tire)\n\n**Recommendation:** Professional\nPuncture assessment and repair should be done by a professional. Tire replacement can be DIY with proper tools and experience.\n\n*severity: caution* | *recommendation: professional*`;
      } else if (lower.includes('engine') || lower.includes('starting') || lower.includes('start')) {
        response = `**Engine Starting Issue**\n\n**Probable Causes:**\n- Weak/dead battery\n- Faulty starter motor\n- Clogged fuel filter\n- Ignition system issue\n- Engine kill switch\n\n**Estimated Cost:** $20–$150 (battery) to $100–$500+ (electrical/ignition)\n\n**Recommendation:** Professional\nElectrical and ignition issues require diagnostic tools. Start with basics: battery voltage, kill switch, fuel flow.\n\n*severity: urgent* | *recommendation: professional*`;
      } else {
        response = `**MotoTrack Mechanic Analysis**\n\nThanks for your query about: "${text}"\n\nTo give you a more accurate diagnosis, please share:\n\n1. **What you observe** — noise, vibration, warning light, performance issue?\n2. **When it happens** — cold start, at speed, under load?\n3. **Your bike's make/model/year** — helps narrow down common issues\n4. **Recent service history** — what was done last?\n\n**Estimated Cost:** $0–$500 (range without more detail)\n\n*severity: caution* | *recommendation: diy*`;
      }

      const assistantMsg: DiagnosticMessage = {
        id: `msg_${++msgIdRef.current}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        result: buildDiagnosticResult(response),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to get diagnostic response');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearHistory };
}
