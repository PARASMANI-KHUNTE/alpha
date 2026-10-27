import { describe, it, expect } from 'vitest';
import { displayValue, displayLabels, groupByStage, stageCounts } from '../utils/contactHelpers';
import type { Contact } from '../types/contact';

describe('contactHelpers', () => {
  describe('displayValue', () => {
    it('returns the string when non-empty', () => {
      expect(displayValue('test@example.com')).toBe('test@example.com');
      expect(displayValue('Acme Corp')).toBe('Acme Corp');
    });

    it('returns em-dash placeholder for null, undefined, or empty/whitespace string', () => {
      expect(displayValue(null)).toBe('—');
      expect(displayValue(undefined)).toBe('—');
      expect(displayValue('')).toBe('—');
      expect(displayValue('   ')).toBe('—');
    });
  });

  describe('displayLabels', () => {
    it('returns comma-separated labels when present', () => {
      expect(displayLabels(['Enterprise', 'VIP'])).toBe('Enterprise, VIP');
      expect(displayLabels(['Sales'])).toBe('Sales');
    });

    it('returns "No labels" when list is empty', () => {
      expect(displayLabels([])).toBe('No labels');
    });
  });

  describe('groupByStage and stageCounts', () => {
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        company: 'Corp A',
        role: 'Engineer',
        owner: 'Owner A',
        labels: ['Tag1'],
        stage: 'Lead',
        notes: 'Note 1',
      },
      {
        id: '2',
        name: 'Bob',
        email: 'bob@example.com',
        company: 'Corp B',
        role: 'Designer',
        owner: 'Owner B',
        labels: [],
        stage: 'Prospect',
        notes: '',
      },
      {
        id: '3',
        name: 'Charlie',
        email: null,
        company: null,
        role: null,
        owner: null,
        labels: [],
        stage: 'Customer',
        notes: '',
      },
    ];

    it('groups contacts by stage and handles empty stages', () => {
      const groups = groupByStage(mockContacts);
      expect(groups.Lead).toHaveLength(1);
      expect(groups.Prospect).toHaveLength(1);
      expect(groups.Qualified).toHaveLength(0); // Empty stage
      expect(groups.Customer).toHaveLength(1);
      expect(groups.Lead[0].name).toBe('Alice');
    });

    it('counts contacts accurately per stage', () => {
      const counts = stageCounts(mockContacts);
      expect(counts).toEqual({
        Lead: 1,
        Prospect: 1,
        Qualified: 0,
        Customer: 1,
      });
    });
  });
});
