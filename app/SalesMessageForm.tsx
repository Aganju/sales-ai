'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Types from the project spec
type SalesTone = 'professional' | 'consultative' | 'dynamic' | 'friendly';

interface Prospect {
  id: string;
  createdAt: string;
  summary: string;
  tone: SalesTone;
  status: 'pending' | 'completed' | 'failed';
  generatedMessage?: string;
  error?: string;
}

const SalesMessageForm = () => {
  const [summary, setSummary] = useState('');
  const [tone, setTone] = useState<SalesTone>('professional');
  const [history, setHistory] = useState<Prospect[]>([]);
  const { toast } = useToast();

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('salesMessageHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('salesMessageHistory', JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProspect: Prospect = {
      //set id based on response from backend after sending request
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      summary,
      tone,
      status: 'pending'
    };

    // Add to history
    setHistory(prev => {
      const updated = [newProspect, ...prev].slice(0, 50); // Keep max 50 entries
      return updated;
    });

    // Clear form
    setSummary('');
    
    toast({
      title: "Request submitted",
      description: "Your sales message is being generated.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Sales Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prospect Summary</label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Enter details about your prospect..."
                className="min-h-32"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message Tone</label>
              <Select value={tone} onValueChange={(value: SalesTone) => setTone(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="consultative">Consultative</SelectItem>
                  <SelectItem value="dynamic">Dynamic</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Generate Message
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((prospect) => (
              <div
                key={prospect.id}
                className="p-4 border rounded-lg space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">{new Date(prospect.createdAt).toLocaleString()}</div>
                  <div className="text-sm">
                    Status: {prospect.status}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Tone: {prospect.tone}
                </div>
                <div className="text-sm">
                  {prospect.summary}
                </div>
                {prospect.generatedMessage && (
                  <div className="text-sm mt-2 p-2 bg-gray-50 rounded">
                    {prospect.generatedMessage}
                  </div>
                )}
                {prospect.error && (
                  <div className="text-sm text-red-600">
                    Error: {prospect.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesMessageForm;