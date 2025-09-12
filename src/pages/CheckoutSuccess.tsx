import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, FileText } from 'lucide-react';

interface LocationState {
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  selectedItems: Array<{
    id: string;
    thumb: string;
    caption: string;
  }>;
  licenseTerms: {
    mediaType: string;
    editingRights: boolean;
    duration: string;
    exclusivity: boolean;
  };
  price: number;
  orderId: string;
}

const CheckoutSuccess = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button asChild variant="cta">
            <Link to="/buyers">Back to Catalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { creator, selectedItems, licenseTerms, price, orderId } = state;

  const downloadLicense = () => {
    const licenseContent = `
STOCKLESS LICENSING AGREEMENT
Order ID: ${orderId}
Date: ${new Date().toLocaleDateString()}

LICENSED CONTENT:
${selectedItems.map((item, index) => `${index + 1}. ${item.caption} (ID: ${item.id})`).join('\n')}

CREATOR: ${creator.name}
BUYER: Licensed User

LICENSE TERMS:
- Media Type: ${licenseTerms.mediaType}
- Editing Rights: ${licenseTerms.editingRights ? 'Granted' : 'Not Granted'}
- Duration: ${licenseTerms.duration}
- Exclusive Rights: ${licenseTerms.exclusivity ? 'Yes' : 'No'}
- Total Price: $${price}

This license grants the buyer the right to use the above content according to the specified terms.
Valid under Estonian law.

Issued by: Stockless OÜ
`;

    const blob = new Blob([licenseContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Stockless_License_${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadMedia = (item: any) => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(0, 0, 640, 640);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('STOCKLESS', 320, 300);
      ctx.fillText('Licensed Content', 320, 340);
      ctx.fillText(item.caption, 320, 380);
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.caption.replace(/\s+/g, '_')}_${item.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">License Successful!</h1>
          <p className="text-muted-foreground">
            You've licensed {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} from {creator.name}
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6 shadow-medium border-0">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Order Details</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Order ID: {orderId}
                </p>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Creator Info */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <img 
                  src={creator.avatar} 
                  alt={creator.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{creator.name}</p>
                  <p className="text-sm text-muted-foreground">Creator</p>
                </div>
              </div>

              {/* License Terms */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div><span className="font-medium">Media Type:</span> {licenseTerms.mediaType}</div>
                <div><span className="font-medium">Editing Rights:</span> {licenseTerms.editingRights ? 'Granted' : 'Not Granted'}</div>
                <div><span className="font-medium">Duration:</span> {licenseTerms.duration}</div>
                <div><span className="font-medium">Exclusive:</span> {licenseTerms.exclusivity ? 'Yes' : 'No'}</div>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Paid</span>
                  <span className="text-2xl font-bold text-success">${price}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Licensed Content */}
        <Card className="mb-6 shadow-medium border-0">
          <CardHeader>
            <CardTitle>Licensed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="relative">
                  <img
                    src={item.thumb}
                    alt={item.caption}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <div className="absolute top-1 right-1">
                    <Badge variant="success" className="text-xs px-1 py-0">
                      Licensed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedItems.length} high-resolution images ready for download
            </p>
          </CardContent>
        </Card>

        {/* Downloads */}
        <Card className="mb-8 shadow-medium border-0">
          <CardHeader>
            <CardTitle>Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button onClick={downloadLicense} variant="cta" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download License Agreement
              </Button>
              
              {selectedItems.map((item) => (
                <Button 
                  key={item.id} 
                  onClick={() => downloadMedia(item)} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download: {item.caption}
                </Button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mb-4">
              Files are ready for download. License terms apply as specified above.
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            A copy of your license agreement and download links have been sent to your email.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="cta">
              <Link to="/buyers">
                Browse More Creators
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;