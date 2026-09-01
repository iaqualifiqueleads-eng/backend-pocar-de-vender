-- Lista clientes duplicados, comparando telefone_principal OU nome já normalizados.
-- Normalização aplicada antes da comparação:
--   telefone: concatena ddd + telefone_principal e remove tudo que não for dígito
--   nome: minúsculas, remove espaços nas pontas e colapsa espaços internos duplicados
-- Um cliente aparece no resultado se bater com pelo menos outro cliente
-- em telefone normalizado OU em nome normalizado (valores vazios/nulos são ignorados
-- para não gerar falsos positivos entre clientes sem telefone/nome preenchido).

WITH normalizado AS (
  SELECT
    c.id                                                            AS clienteId,
    c.nome,
    c.ddd,
    c.telefone_principal,
    TRIM(REGEXP_REPLACE(LOWER(c.nome), '[[:space:]]+', ' '))        AS nome_normalizado,
    NULLIF(
      CONCAT(
        REGEXP_REPLACE(c.ddd, '[^0-9]', ''),
        REGEXP_REPLACE(c.telefone_principal, '[^0-9]', '')
      ),
      ''
    )                                                                AS telefone_normalizado
  FROM cliente c
  WHERE c.deletedAt IS NULL
),
com_contagem AS (
  SELECT
    n.*,
    COUNT(*) OVER (PARTITION BY n.telefone_normalizado)             AS qtd_mesmo_telefone,
    COUNT(*) OVER (PARTITION BY NULLIF(n.nome_normalizado, ''))     AS qtd_mesmo_nome
  FROM normalizado n
)
SELECT
  clienteId,
  nome,
  nome_normalizado,
  ddd,
  telefone_principal,
  telefone_normalizado,
  qtd_mesmo_telefone,
  qtd_mesmo_nome,
  CASE
    WHEN telefone_normalizado IS NOT NULL AND qtd_mesmo_telefone > 1
     AND nome_normalizado <> '' AND qtd_mesmo_nome > 1 THEN 'telefone e nome'
    WHEN telefone_normalizado IS NOT NULL AND qtd_mesmo_telefone > 1 THEN 'telefone'
    ELSE 'nome'
  END                                                                AS motivo_duplicidade
FROM com_contagem
WHERE (telefone_normalizado IS NOT NULL AND qtd_mesmo_telefone > 1)
   OR (nome_normalizado <> '' AND qtd_mesmo_nome > 1)
ORDER BY
  COALESCE(telefone_normalizado, ''),
  nome_normalizado,
  clienteId;
