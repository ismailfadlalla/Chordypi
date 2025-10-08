"""
Proxy Configuration for YouTube Downloads
Supports multiple proxy services to bypass IP blocking

To enable proxy:
1. Sign up for a proxy service (recommendations below)
2. Set environment variable PROXY_URL in .env file
3. Example: PROXY_URL=http://username:password@proxy.service.com:port

Recommended Proxy Services:
1. Webshare.io - $1/GB residential proxies
   - Website: https://www.webshare.io/
   - Format: http://username:password@proxy.webshare.io:80
   
2. Smartproxy - $2.50/GB residential proxies  
   - Website: https://smartproxy.com/
   - Format: http://username:password@gate.smartproxy.com:7000
   
3. Bright Data - $0.001 per request
   - Website: https://brightdata.com/
   - Format: http://username:password@brd.superproxy.io:22225

Cost Estimate:
- Average song download: ~5-10MB audio
- 100 songs = ~500MB-1GB
- With Webshare: $1-2/month for 100 songs
- With Smartproxy: $2.50-5/month for 100 songs
"""

import os
from dotenv import load_dotenv

load_dotenv()

class ProxyConfig:
    """Proxy configuration for YouTube downloads"""
    
    # Get proxy URL from environment variable
    PROXY_URL = os.getenv('PROXY_URL', None)
    
    # Enable/disable proxy usage
    PROXY_ENABLED = bool(PROXY_URL)
    
    @classmethod
    def get_proxy_dict(cls):
        """
        Get proxy configuration dict for yt-dlp
        Returns None if proxy is disabled
        """
        if not cls.PROXY_ENABLED:
            return None
            
        return {
            'http': cls.PROXY_URL,
            'https': cls.PROXY_URL
        }
    
    @classmethod
    def get_ytdl_proxy(cls):
        """
        Get proxy string for yt-dlp configuration
        Returns None if proxy is disabled
        """
        return cls.PROXY_URL if cls.PROXY_ENABLED else None
    
    @classmethod
    def get_status(cls):
        """Get current proxy status"""
        if cls.PROXY_ENABLED:
            # Mask password in URL for security
            masked_url = cls._mask_password(cls.PROXY_URL)
            return {
                'enabled': True,
                'url': masked_url,
                'service': cls._detect_service(cls.PROXY_URL)
            }
        else:
            return {
                'enabled': False,
                'url': None,
                'service': None,
                'recommendation': 'Set PROXY_URL environment variable to enable proxy'
            }
    
    @classmethod
    def _mask_password(cls, url):
        """Mask password in proxy URL for logging"""
        if not url:
            return None
            
        import re
        # Replace password with asterisks
        # Format: http://username:password@host:port
        pattern = r'(https?://[^:]+:)[^@]+(@.+)'
        return re.sub(pattern, r'\1****\2', url)
    
    @classmethod
    def _detect_service(cls, url):
        """Detect which proxy service is being used"""
        if not url:
            return None
            
        url_lower = url.lower()
        
        if 'webshare' in url_lower:
            return 'Webshare.io'
        elif 'smartproxy' in url_lower:
            return 'Smartproxy'
        elif 'brightdata' in url_lower or 'luminati' in url_lower:
            return 'Bright Data'
        elif 'oxylabs' in url_lower:
            return 'Oxylabs'
        elif 'scraperapi' in url_lower:
            return 'ScraperAPI'
        else:
            return 'Custom Proxy'

# Print status on import
if __name__ == '__main__':
    status = ProxyConfig.get_status()
    print(f"Proxy Status: {status}")
