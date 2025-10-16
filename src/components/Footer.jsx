export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-50 to-blue-100 py-6 text-center text-gray-700 shadow-inner mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 px-4">
        {/* Brand */}
        <h3 className="text-lg font-semibold text-indigo-600 hover:text-indigo-700 transition">
          E-CART
        </h3>

        {/* Links */}
        

        {/* Copyright */}
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-indigo-600">E-CART</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
