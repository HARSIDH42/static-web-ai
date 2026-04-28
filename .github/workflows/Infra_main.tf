resource "aws_s3_bucket" "staticwebzsitegit" {
  bucket = "staticwebzsitegit"

  tags = {
    Name        = "staticwebzsitegit"
    Environment = "Production"
    Project     = "Static Website Deployment"
  }
}

resource "aws_s3_bucket_website_configuration" "staticwebzsitegit" {
  bucket = aws_s3_bucket.staticwebzsitegit.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "staticwebzsitegit" {
  bucket = aws_s3_bucket.staticwebzsitegit.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "staticwebzsitegit_policy" {
  bucket = aws_s3_bucket.staticwebzsitegit.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.staticwebzsitegit.arn}/*"
      }
    ]
  })
}
