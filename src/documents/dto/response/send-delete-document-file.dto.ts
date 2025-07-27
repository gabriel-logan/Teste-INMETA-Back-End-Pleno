import { ApiProperty } from "@nestjs/swagger";

export class SendDeleteDocumentFileResponseDto {
  @ApiProperty({
    description: "Message indicating the result of the operation",
    example: "Document file deleted successfully",
  })
  public readonly message: string;

  @ApiProperty({
    description: "URL of the document",
    example: "https://example.com/files/document.pdf",
  })
  public readonly documentUrl: string;
}
