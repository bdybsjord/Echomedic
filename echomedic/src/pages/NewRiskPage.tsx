import { useNavigate } from "react-router-dom";
import { RiskForm } from "../components/risk/RiskForm";
import { createRisk, type RiskInput } from "../services/riskService";

export const NewRiskPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: RiskInput) => {
    await createRisk(values);
    navigate("/risks");
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Ny risiko</h1>
      <RiskForm onSubmit={handleSubmit} submitLabel="Opprett risiko" />
    </div>
  );
};
