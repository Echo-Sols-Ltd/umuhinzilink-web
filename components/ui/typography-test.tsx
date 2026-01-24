'use client';

import React from 'react';
import { Heading, Text } from './typography';

export function TypographyTest() {
  return (
    <div className="p-8 space-y-4">
      <Heading variant="h1" color="primary">
        Typography Test
      </Heading>
      <Text variant="body">
        This is a test of the enhanced typography system.
      </Text>
      <Heading variant="h2" gradient>
        Gradient Heading
      </Heading>
      <Text variant="lead" color="muted">
        This is lead text with muted color.
      </Text>
    </div>
  );
}