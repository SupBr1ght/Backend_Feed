
echo ">>> Running Mongo init script..."


sleep 5

echo ">>> Creating replica set..."

mongosh --eval "rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }]
})" || true

echo ">>> Mongo init done"
