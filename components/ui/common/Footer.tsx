'use client';

interface FooterProps {
  onShowDisclosures?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowDisclosures }) => {
  return (
    <div className="w-full border-t border-neutral-800/50 fixed bottom-0 left-0 bg-[#121212]">
      <div className="max-w-md mx-auto w-full py-4 px-6">
        <button 
          onClick={onShowDisclosures}
          className="text-center text-neutral-500 text-sm w-full"
        >
          See legal disclosures
        </button>
      </div>
    </div>
  );
};

export default Footer;
