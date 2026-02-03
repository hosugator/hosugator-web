#!/bin/bash
# deploy-assets.sh

echo "1. 모든 자산(projects, profile 등)을 S3에 동기화 중..."
# 로컬의 public 폴더 안 내용을 S3 버킷 루트에 동기화
aws s3 sync ./public/ s3://hosugator.com/ --exclude ".DS_Store" --exclude "*.js" --exclude "*.map"

echo "2. CloudFront 캐시 무효화 중..."
aws cloudfront create-invalidation --distribution-id E36M7TT0F7EFQ6 --paths "/*"

echo "완료되었습니다!"