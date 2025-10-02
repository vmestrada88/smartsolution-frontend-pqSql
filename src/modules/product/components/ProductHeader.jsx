/**
 * ProductHeader component displays the header section for the Products page.
 * It includes the main title and a descriptive subtitle.
 */
export default function ProductHeader() {
  return (
    <>
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Our Catalog</h1>
      <h2 className="text-gray-600 mb-6">
        <strong>Browse our selection of high-quality products. Click on a product to add it to your invoice
        and view installation costs.</strong>
      </h2>
    </>
  );
}