import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Aurora Hotel - Leftmost Column */}
            <div className="col-span-1">
              <h3 className="text-xl font-bold mb-4">Aurora Hotel</h3>
              <p className="text-white/90 mb-4 text-sm">
                12 Nguyễn Văn Bảo, Hạnh Thông, TP.HCM
              </p>
              {/* Google Map */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.8581690910423!2d106.68427047457543!3d10.822164158349356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2sIndustrial%20University%20of%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1764296304458!5m2!1sen!2s"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
              <Link
                to="/about"
                className="inline-block px-6 py-2 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors text-sm"
              >
                About us &gt;
              </Link>
            </div>

            {/* Contact - Second Column */}
            <div className="col-span-1">
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-white/90 text-sm">
                <div>Hotline: 0353 999 999</div>
                <div>Email: auroracskh@gmail.vn</div>
              </div>
            </div>

            {/* Catalogue - Third Column */}
            <div className="col-span-1">
              <h3 className="text-xl font-bold mb-4">Catalogue</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/accommodation" className="text-white/90 hover:text-white transition-colors text-sm">
                    Accommodation
                  </Link>
                </li>
                <li>
                  <Link to="/service" className="text-white/90 hover:text-white transition-colors text-sm">
                    Restaurant
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="text-white/90 hover:text-white transition-colors text-sm">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-white/90 hover:text-white transition-colors text-sm">
                    Media
                  </Link>
                </li>
                <li>
                  <span className="text-white/90 text-sm">Promotions</span>
                </li>
              </ul>
            </div>

            {/* Follow us - Rightmost Column */}
            <div className="col-span-1">
              <h3 className="text-xl font-bold mb-4">Follow us</h3>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="Email"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Strip */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              ©2025 Aurora Hotel | Designed by The Challenger Team
            </p>
            {/* Scroll to Top Button */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="mt-4 sm:mt-0 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all shadow-lg"
                aria-label="Scroll to top"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
