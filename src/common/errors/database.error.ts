import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseError extends HttpException {
  constructor(error: any) {
    // Tratando erros específicos do MySQL
    if (error.code === 'ER_DUP_ENTRY') {
      super(
        {
          status: HttpStatus.CONFLICT,
          error: 'Conflito de dados',
          message: 'Registro duplicado no banco de dados',
          detail: error.sqlMessage,
        },
        HttpStatus.CONFLICT,
      );
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      super(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Erro de referência',
          message: 'Referência inválida para chave estrangeira',
          detail: error.sqlMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
      super(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Campo não pode ser nulo',
          message: 'O campo não pode ser nulo',
          detail: error.sqlMessage,
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      super(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Erro de banco de dados',
          message: 'Ocorreu um erro ao acessar o banco de dados',
          detail: error.sqlMessage,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
