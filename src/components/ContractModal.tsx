import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  creatorName: string;
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, onSign, creatorName }) => {
  const handlePreviewContract = () => {
    // Create a mock contract content
    const contractContent = `
LICENSING AGREEMENT FOR PHOTO AND VIDEO COPYRIGHT
PURSUANT TO ESTONIAN COPYRIGHT ACT

This agreement is made between:
Creator: ${creatorName}
Platform: Stockless OÜ
Location: Estonia

TERMS AND CONDITIONS:

1. INTELLECTUAL PROPERTY RIGHTS
   - Creator retains full copyright ownership
   - Platform receives limited licensing rights for distribution
   - All rights remain with creator unless explicitly transferred

2. LICENSING TERMS
   - Creator grants permission to license content to third parties
   - Each license requires creator approval
   - Revenue sharing: 70% creator, 30% platform

3. CONTENT STANDARDS
   - All content must be original work
   - Creator warrants ownership of all rights
   - Content must comply with Estonian law

4. TERMINATION
   - Either party may terminate with 30 days notice
   - Content removed within 48 hours of termination

By signing, creator agrees to these terms under Estonian law.

Date: ${new Date().toLocaleDateString()}
Creator: ${creatorName}
`;

    // Create a blob and download it as PDF-like text file
    const blob = new Blob([contractContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Stockless_Contract_${creatorName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenContract = () => {
    // Open contract in new window for preview
    const contractContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Stockless Licensing Contract</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2563eb; text-align: center; }
        h2 { color: #1e40af; margin-top: 30px; }
        .signature { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; }
    </style>
</head>
<body>
    <h1>LICENSING AGREEMENT FOR PHOTO AND VIDEO COPYRIGHT</h1>
    <h2>PURSUANT TO ESTONIAN COPYRIGHT ACT</h2>
    
    <p><strong>This agreement is made between:</strong></p>
    <p>Creator: ${creatorName}<br>
    Platform: Stockless OÜ<br>
    Location: Estonia</p>
    
    <h2>TERMS AND CONDITIONS:</h2>
    
    <h3>1. INTELLECTUAL PROPERTY RIGHTS</h3>
    <ul>
        <li>Creator retains full copyright ownership</li>
        <li>Platform receives limited licensing rights for distribution</li>
        <li>All rights remain with creator unless explicitly transferred</li>
    </ul>
    
    <h3>2. LICENSING TERMS</h3>
    <ul>
        <li>Creator grants permission to license content to third parties</li>
        <li>Each license requires creator approval</li>
        <li>Revenue sharing: 70% creator, 30% platform</li>
    </ul>
    
    <h3>3. CONTENT STANDARDS</h3>
    <ul>
        <li>All content must be original work</li>
        <li>Creator warrants ownership of all rights</li>
        <li>Content must comply with Estonian law</li>
    </ul>
    
    <h3>4. TERMINATION</h3>
    <ul>
        <li>Either party may terminate with 30 days notice</li>
        <li>Content removed within 48 hours of termination</li>
    </ul>
    
    <div class="signature">
        <p><strong>By signing, creator agrees to these terms under Estonian law.</strong></p>
        <p>Date: ${new Date().toLocaleDateString()}<br>
        Creator: ${creatorName}</p>
    </div>
</body>
</html>
`;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(contractContent);
      newWindow.document.close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Estonian Licensing Contract</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Before connecting your social media account, you must sign the licensing agreement 
            in accordance with Estonian copyright law for photo and video content.
          </p>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={handleOpenContract}
              className="w-full justify-start"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview Contract (New Window)
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handlePreviewContract}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Contract
            </Button>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="cta" onClick={onSign} className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Sign Contract
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractModal;