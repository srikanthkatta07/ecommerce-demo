package com.ecommerce.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmazonS3Config {

  @Bean
  public AmazonS3 amazonS3() {
    String accessKey = System.getenv("AWS_ACCESS_KEY"); // Fetch from environment variables
    String secretKey = System.getenv("AWS_SECRET_KEY"); // Fetch from environment variables
    String region = System.getenv("AWS_REGION"); // Fetch from environment variables

    BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
    return AmazonS3ClientBuilder.standard()
        .withRegion(region)
        .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
        .build();
  }
}
