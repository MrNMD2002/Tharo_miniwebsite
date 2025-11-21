import { useState, useEffect, useRef, useCallback } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions<T> {
    data: T;
    onSave: (data: T) => Promise<void>;
    debounceMs?: number;
    enabled?: boolean;
}

interface UseAutoSaveReturn {
    status: SaveStatus;
    error: string | null;
    lastSavedAt: Date | null;
    manualSave: () => Promise<void>;
}

/**
 * Auto-save hook with debounce
 * 
 * @example
 * const { status, error } = useAutoSave({
 *   data: formData,
 *   onSave: async (data) => {
 *     await fetch('/api/products', { method: 'POST', body: JSON.stringify(data) })
 *   },
 *   debounceMs: 1000
 * });
 */
export function useAutoSave<T>({
    data,
    onSave,
    debounceMs = 1000,
    enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);
    const previousDataRef = useRef<T>(data);

    // Track if this is the first render
    const isFirstRenderRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const executeSave = useCallback(async () => {
        if (!isMountedRef.current || !enabled) return;

        try {
            setStatus('saving');
            setError(null);
            
            await onSave(data);
            
            if (isMountedRef.current) {
                setStatus('saved');
                setLastSavedAt(new Date());
                
                // Reset to idle after 2 seconds
                setTimeout(() => {
                    if (isMountedRef.current) {
                        setStatus('idle');
                    }
                }, 2000);
            }
        } catch (err) {
            if (isMountedRef.current) {
                setStatus('error');
                setError(err instanceof Error ? err.message : 'Lỗi khi lưu');
                
                // Reset error after 5 seconds
                setTimeout(() => {
                    if (isMountedRef.current) {
                        setStatus('idle');
                        setError(null);
                    }
                }, 5000);
            }
        }
    }, [data, onSave, enabled]);

    useEffect(() => {
        // Skip auto-save on first render
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            previousDataRef.current = data;
            return;
        }

        if (!enabled) return;

        // Check if data actually changed
        if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
            return;
        }

        previousDataRef.current = data;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debounced save
        timeoutRef.current = setTimeout(() => {
            executeSave();
        }, debounceMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, debounceMs, enabled, executeSave]);

    const manualSave = useCallback(async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        await executeSave();
    }, [executeSave]);

    return {
        status,
        error,
        lastSavedAt,
        manualSave,
    };
}

