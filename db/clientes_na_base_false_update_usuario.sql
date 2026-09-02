-- Clientes com na_base = 0 cujo ULTIMO contato tenha SOMENTE ocorrencias
-- 'Nunca atendeu' (17733364004864), 'Nao usa canto' (4) ou 'Nao ligar' (18).
-- (Se o ultimo contato tiver qualquer outra ocorrencia junto, o cliente NAO entra.)

-- 1) Conferir os clientes que serao afetados
SELECT c.id,
       c.nome,
       c.cnpj,
       c.ddd,
       c.telefone_principal,
       c.ultimo_contato,
       c.na_base,
       c.usuarioId,
       GROUP_CONCAT(DISTINCT o.nome ORDER BY o.nome SEPARATOR ', ') AS ultimas_ocorrencias
FROM cliente c
JOIN (
  SELECT clienteId, MAX(id) AS ultimo_contato_id
  FROM contato
  WHERE deletedAt IS NULL
  GROUP BY clienteId
) u ON u.clienteId = c.id
JOIN contato_ocorrencias_ocorrencia co ON co.contatoId = u.ultimo_contato_id
JOIN ocorrencia o ON o.id = co.ocorrenciaId
WHERE c.deletedAt IS NULL
  AND c.na_base = 0
GROUP BY c.id, c.nome, c.cnpj, c.ddd, c.telefone_principal, c.ultimo_contato, c.na_base, c.usuarioId
HAVING SUM(o.id NOT IN (17733364004864, 4, 18)) = 0
ORDER BY c.nome;

-- 2) Atualizar o usuario responsavel desses clientes
UPDATE cliente c
JOIN (
  SELECT c2.id
  FROM cliente c2
  JOIN (
    SELECT clienteId, MAX(id) AS ultimo_contato_id
    FROM contato
    WHERE deletedAt IS NULL
    GROUP BY clienteId
  ) u ON u.clienteId = c2.id
  JOIN contato_ocorrencias_ocorrencia co ON co.contatoId = u.ultimo_contato_id
  WHERE c2.deletedAt IS NULL
    AND c2.na_base = 0
  GROUP BY c2.id
  HAVING SUM(co.ocorrenciaId NOT IN (17733364004864, 4, 18)) = 0
) alvo ON alvo.id = c.id
SET c.usuarioId = 1039546764288,
    c.updatedAt = CURRENT_TIMESTAMP(6);
