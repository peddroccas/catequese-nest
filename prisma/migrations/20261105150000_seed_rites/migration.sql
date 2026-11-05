-- Ritos que a paróquia já tem (todos valem para todas as turmas). Os PDFs ficam no app (catequese-app/public/ritos), por isso a url é
-- relativa: abre na mesma origem do front. PDFs anexados depois pela tela vão
-- para o Supabase Storage.
INSERT INTO "rites" ("id", "name", "description") VALUES
  ('7cd1396f-421c-408f-96f1-1d8ec6787d02', 'Celebração de entrada para o tempo de catequese', NULL),
  ('3b7f2183-7e05-48f7-a68d-79b7da1f72bd', 'Entrega da Palavra de Deus (em sala)', NULL),
  ('c3a549bc-855e-4cc9-a60e-5cc8883bcf35', 'Celebração da Palavra de Deus – Crianças', NULL),
  ('f4efa25d-97b7-4d4f-9c00-7b161ec1f531', 'Celebração da Palavra de Deus – Jovens e Adultos', NULL),
  ('7e155dea-ecdc-485e-958b-4ab495d4a34c', 'Entrega da Oração do Senhor (em sala)', NULL),
  ('0d951194-a4cf-4062-b8d4-e321a917cd75', 'Entrega da Oração do Senhor (Santa Missa)', NULL),
  ('1d1c9a85-8144-428a-b80a-394b6bebdf3c', 'Entrega do Símbolo da Fé e da vela', NULL),
  ('0ee2403b-4f56-48d2-a904-80bab98a36c0', 'Celebração de Eleição', NULL),
  ('a62a7db2-bb8a-4b23-8f0d-1602d3be5ea4', 'Celebração de Envio Missionário', NULL)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "rite_files" ("id", "name", "url", "riteId", "createdAt") VALUES
  ('a8a1cd05-bcdd-59dc-9ba9-56c6057b5a26', 'Celebração de entrada para o tempo de catequese.pdf', '/ritos/entrada-tempo-catequese.pdf', '7cd1396f-421c-408f-96f1-1d8ec6787d02', TIMESTAMP '2026-11-05 12:00:00'),
  ('70a2f554-002f-5b70-a7ce-08f8fcb3e7f6', 'Entrega da Palavra de Deus (Em sala).pdf', '/ritos/entrega-palavra-de-deus-em-sala.pdf', '3b7f2183-7e05-48f7-a68d-79b7da1f72bd', TIMESTAMP '2026-11-05 12:00:00'),
  ('224377d0-7b49-5aa0-b4b6-61ab8998d4ab', 'Celebração da Palavra de Deus - Crianças.pdf', '/ritos/celebracao-palavra-de-deus-criancas.pdf', 'c3a549bc-855e-4cc9-a60e-5cc8883bcf35', TIMESTAMP '2026-11-05 12:00:00'),
  ('93f4e4a9-0f39-5bec-bf8f-4989b24a5c6c', 'Celebração da Palavra de Deus - Jovens e Adultos.pdf', '/ritos/celebracao-palavra-de-deus-jovens-e-adultos.pdf', 'f4efa25d-97b7-4d4f-9c00-7b161ec1f531', TIMESTAMP '2026-11-05 12:00:00'),
  ('f06d88c5-4153-5df6-acdc-a319292bc015', 'Entrega da Oração do Senhor (Em sala).pdf', '/ritos/entrega-oracao-do-senhor-em-sala.pdf', '7e155dea-ecdc-485e-958b-4ab495d4a34c', TIMESTAMP '2026-11-05 12:00:00'),
  ('a0aa0212-86b4-5582-8539-52acab029d8a', 'Entrega da Oração do Senhor (Santa Missa).pdf', '/ritos/entrega-oracao-do-senhor-santa-missa.pdf', '0d951194-a4cf-4062-b8d4-e321a917cd75', TIMESTAMP '2026-11-05 12:00:00'),
  ('9af9ae8d-434a-5967-8409-0387aa618f6b', 'Rito de Celebração da Entrega do Símbolo da fé e vela.pdf', '/ritos/entrega-simbolo-da-fe-e-vela.pdf', '1d1c9a85-8144-428a-b80a-394b6bebdf3c', TIMESTAMP '2026-11-05 12:00:00'),
  ('3bd57b6e-c04b-5e56-acde-f3a0649ee522', 'Folder Rito - Símbolo da Fé.pdf', '/ritos/folder-simbolo-da-fe.pdf', '1d1c9a85-8144-428a-b80a-394b6bebdf3c', TIMESTAMP '2026-11-05 12:00:01'),
  ('4ed21327-bc8d-5db8-8533-71f74c8a5f70', 'Rito de Celebração de Eleição.pdf', '/ritos/celebracao-de-eleicao.pdf', '0ee2403b-4f56-48d2-a904-80bab98a36c0', TIMESTAMP '2026-11-05 12:00:00'),
  ('d40e0549-7546-577b-ab30-e0d52c9d0f20', 'Rito de Celebração de Envio Missionário.pdf', '/ritos/envio-missionario.pdf', 'a62a7db2-bb8a-4b23-8f0d-1602d3be5ea4', TIMESTAMP '2026-11-05 12:00:00'),
  ('5e5e9220-bdb2-579e-8950-bb49f815ce37', 'Caderneta Rito - Oração do Senhor.pdf', '/ritos/caderneta-oracao-do-senhor.pdf', '7e155dea-ecdc-485e-958b-4ab495d4a34c', TIMESTAMP '2026-11-05 12:00:01'),
  ('12a3dcbe-9e3e-5288-b8c4-0cca78dfe535', 'Caderneta Rito - Oração do Senhor.pdf', '/ritos/caderneta-oracao-do-senhor.pdf', '0d951194-a4cf-4062-b8d4-e321a917cd75', TIMESTAMP '2026-11-05 12:00:01')
ON CONFLICT ("id") DO NOTHING;
