import { Injectable } from '@angular/core';
import { JSEncrypt } from 'jsencrypt';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp0Qjb5BElYYOwwCDjNHt
U5QpV3R9zLhk+Nz7slsDrDKXcG6rVMF43q3Fki6F883jVdun1AmGYA+G1rwjYgwz
+3rGYiidPfeUWrkfvoIy5Pf8c6rafT1zGma/QzrcUCMAvNVAGjTqZr+fXEGMfZ92
iEEhp/snTH2JLEc4nl5c2IVeIpe9MoDvvQ/WD4pGg8yTLDUOuwIVhnXo4V6WM62n
9YZFS6gq3i/cJC5Ro8nI7FBrKFngAjODhSgG9uvZ24kfdoC1W9oLwL2avgNfATRe
1cXN6aVQmUCQX6FLiojWbUghdDePOEw8F7mpC4gbGrpZm4q9dFvMfyQfFR2O3cqH
XQIDAQAB
-----END PUBLIC KEY-----
`;

  encrypt(data: any): string {

    const encrypt = new JSEncrypt();

    encrypt.setPublicKey(this.publicKey);

    return encrypt.encrypt(
      JSON.stringify(data)
    ) || '';
  }
}