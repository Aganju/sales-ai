import SalesMessageForm from "./SalesMessageForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8">
          AI Sales Message Generator
        </h1>
        <SalesMessageForm />
      </div>
    </main>
  );
}
