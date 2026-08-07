export default function Footer() {
  return (
    <footer className="bg-white text-center py-6 text-sm border-t border-gray-200">
      <p className="text-gray-700">
        © {new Date().getFullYear()} Knowlet | All rights reserved
      </p>

      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            className="text-blue-600 hover:text-blue-800 transition-colors"
            href="mailto:knowlet.official@gmail.com"
          >
            Email
          </a>

          <a
            className="text-blue-600 hover:text-blue-800 transition-colors"
            href="/about"
          >
            About
          </a>

          <a
            className="text-blue-600 hover:text-blue-800 transition-colors"
            href="/help"
          >
            Help
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            className="text-blue-600 hover:text-blue-800 transition-colors"
            href="/terms-and-conditions"
          >
            Terms & Conditions
          </a>

          <a
            className="text-blue-600 hover:text-blue-800 transition-colors"
            href="/privacy-policy"
          >
            Privacy Policy
          </a>

          <a
            className="text-blue-600 hover:text-blue-800 transition-colors"
            href="/declaration"
          >
            Declaration
          </a>
        </div>
      </div>
    </footer>
  );
}