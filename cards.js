      spouse_nid=@spouseNid, occupation=@occupation, social_status=@socialStatus, ward=@ward,
      village=@village, upazila=@upazila, district=@district, photo=@photo, updated_at=@updatedAt
    WHERE id=@id
  `).run({ ...v, photo: newPhoto || existing.photo, updatedAt: new Date().toISOString(), id: existing.id });

  if (newPhoto && existing.photo) removePhoto(existing.photo);

  const row = db.prepare('SELECT * FROM cards WHERE id = ?').get(existing.id);
  res.json({ card: toCard(row) });
});

// DELETE /api/cards/:code — শুধু admin মুছতে পারবে
router.delete('/:code', requireRole('admin'), (req, res) => {
  const row = db.prepare('SELECT * FROM cards WHERE unique_code = ?').get(req.params.code);
  if (!row) return res.status(404).json({ error: 'কার্ড পাওয়া যায়নি।' });

  db.prepare('DELETE FROM cards WHERE id = ?').run(row.id);
  removePhoto(row.photo);
  res.json({ ok: true });
});

module.exports = router;
