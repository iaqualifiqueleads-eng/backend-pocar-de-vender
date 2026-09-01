-- Adiciona coluna motivoTransferencia na tabela cliente
ALTER TABLE `cliente`
  ADD COLUMN `motivoTransferencia` longtext NULL;
