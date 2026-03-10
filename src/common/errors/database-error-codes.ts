export const DATABASE_ERROR_CODES = {
  ER_DUP_ENTRY: 'ER_DUP_ENTRY', // Entrada duplicada
  ER_NO_REFERENCED_ROW_2: 'ER_NO_REFERENCED_ROW_2', // Erro de chave estrangeira
  ER_BAD_NULL_ERROR: 'ER_BAD_NULL_ERROR', // Campo não pode ser nulo
  ER_BAD_FIELD_ERROR: 'ER_BAD_FIELD_ERROR', // Campo não existe
  ER_DATA_TOO_LONG: 'ER_DATA_TOO_LONG', // Dado muito longo
  ER_PARSE_ERROR: 'ER_PARSE_ERROR', // Erro de sintaxe SQL
  ER_NO_DEFAULT_FOR_FIELD: 'ER_NO_DEFAULT_FOR_FIELD', // Campo sem valor default
} as const;
