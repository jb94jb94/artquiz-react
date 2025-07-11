import json

input_path = "artists.json"

# Pfad zur Ausgabedatei
output_path = "artists_sorted_by_relevance.json"

# Lade die JSON-Daten
with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Sortiere die Liste nach "relevance" absteigend
sorted_data = sorted(data, key=lambda x: x["relevance"], reverse=True)

# Speichere die sortierten Daten in eine neue Datei
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(sorted_data, f, ensure_ascii=False, indent=2)

print(f"Datei erfolgreich gespeichert unter: {output_path}")