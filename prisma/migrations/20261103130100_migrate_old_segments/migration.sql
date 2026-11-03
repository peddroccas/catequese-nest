-- Converte os segmentos da API antiga para os nomes atuais
UPDATE "classrooms" SET "segment" = 'Eucaristia 1' WHERE "segment" IN ('1° Eucaristia', 'Pré-Eucaristia', 'Sementinha');
UPDATE "classrooms" SET "segment" = 'Crisma 1' WHERE "segment" = 'Crisma';
