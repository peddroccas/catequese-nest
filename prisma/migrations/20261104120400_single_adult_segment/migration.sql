-- Só existe um segmento de adultos: "Catequese Adultos"
UPDATE "classrooms" SET "segment" = 'Catequese Adultos'
WHERE "segment" IN ('Catecúmenos Adultos', 'Catequizandos Adultos');
