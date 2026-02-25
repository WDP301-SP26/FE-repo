export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-red-600">Free-rider Alerts</h1>
        <p className="text-muted-foreground">
          Students flagged for suspiciously low contribution.
        </p>
      </div>
      <div className="p-8 border rounded-lg border-red-200 text-center text-red-600 bg-red-50">
        No free-riders detected currently.
      </div>
    </div>
  );
}
