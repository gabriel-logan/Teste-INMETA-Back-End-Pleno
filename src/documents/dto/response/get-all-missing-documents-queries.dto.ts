import { ApiProperty } from "@nestjs/swagger";
import { DocumentFullResponseDto } from "src/common/dto/response/document.dto";

export class GetAllMissingDocumentsQueriesResponseDto {
  @ApiProperty({
    type: DocumentFullResponseDto,
    isArray: true,
    description: "List of documents that are missing for the employee",
  })
  public readonly documents: DocumentFullResponseDto[];

  @ApiProperty({
    description: "Total number of missing documents",
    example: 42,
  })
  public readonly total: number;

  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  public readonly page: number;

  @ApiProperty({
    description: "Number of documents per page",
    example: 0,
  })
  public readonly limit: number;
}
