import { Card, CardContent } from '@/components/ui/card';
import { loanPrograms } from '@/lib/data/loan-programs';

export function LoanPrograms() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {loanPrograms.map((program) => (
        <Card key={program.id}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">{program.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{program.description}</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Interest Rate:</span> {program.interestRate}%</p>
              <p><span className="font-medium">Term:</span> {program.term}</p>
              <p><span className="font-medium">Requirements:</span> {program.requirements}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}