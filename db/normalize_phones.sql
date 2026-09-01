-- Normaliza telefones de clientes (somente dígitos), sem alterar dados.
-- Cobre as duas origens de telefone:
--   1) cliente.ddd + cliente.telefone_principal (telefone principal)
--   2) telefone.ddd + telefone.numero (telefones adicionais, via cliente_telefones_telefone)

SELECT
  c.id                                                          AS clienteId,
  c.nome                                                        AS clienteNome,
  'principal'                                                   AS tipo,
  c.ddd                                                         AS ddd_original,
  c.telefone_principal                                          AS numero_original,
  REGEXP_REPLACE(c.ddd, '[^0-9]', '')                           AS ddd_normalizado,
  REGEXP_REPLACE(c.telefone_principal, '[^0-9]', '')            AS numero_normalizado,
  CONCAT(
    REGEXP_REPLACE(c.ddd, '[^0-9]', ''),
    REGEXP_REPLACE(c.telefone_principal, '[^0-9]', '')
  )                                                              AS telefone_completo_normalizado
FROM cliente c
WHERE c.deletedAt IS NULL

UNION ALL

SELECT
  c.id                                                          AS clienteId,
  c.nome                                                        AS clienteNome,
  'adicional'                                                   AS tipo,
  t.ddd                                                         AS ddd_original,
  t.numero                                                      AS numero_original,
  REGEXP_REPLACE(t.ddd, '[^0-9]', '')                           AS ddd_normalizado,
  REGEXP_REPLACE(t.numero, '[^0-9]', '')                        AS numero_normalizado,
  CONCAT(
    REGEXP_REPLACE(t.ddd, '[^0-9]', ''),
    REGEXP_REPLACE(t.numero, '[^0-9]', '')
  )                                                              AS telefone_completo_normalizado
FROM cliente c
JOIN cliente_telefones_telefone ct ON ct.clienteId = c.id
JOIN telefone t ON t.id = ct.telefoneId
WHERE c.deletedAt IS NULL
  AND t.deletedAt IS NULL

ORDER BY clienteId, tipo;
