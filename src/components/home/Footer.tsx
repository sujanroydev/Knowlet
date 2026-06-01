export default function Footer() {
  return (
    <footer className="bg-white text-center py-6 text-sm border-t border-gray-200">
      <p className="text-gray-700">© 2025 Knowlet | All rights reserved</p>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          className="text-blue-600 hover:text-blue-800 transition-colors"
          href="mailto:knowlet.study@gmail.com"
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
    </footer>
  );
}
