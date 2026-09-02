-- Clientes cuja ULTIMA ocorrencia (do ultimo contato) seja
-- 'Nunca atendeu', 'Nao usa canto' ou 'Nao ligar' -- 1 linha por cliente.
SELECT c.id,
       c.nome,
       c.cnpj,
       c.ddd,
       c.telefone_principal,
       c.ultimo_contato,
       us.id   AS usuario_id,
       us.nome AS usuario_nome,
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
LEFT JOIN usuario us ON us.id = c.usuarioId
WHERE c.deletedAt IS NULL
GROUP BY c.id, c.nome, c.cnpj, c.ddd, c.telefone_principal, c.ultimo_contato, us.id, us.nome
HAVING SUM(o.id IN (17733364004864, 4, 18)) > 0
ORDER BY us.nome, c.nome;
