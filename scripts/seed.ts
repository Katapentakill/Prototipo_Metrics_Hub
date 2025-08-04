// scripts/seed.ts
import { runFaker } from '../src/lib/database/faker';

async function main() {
  try {
    console.log('🚀 Iniciando seeder de base de datos...');
    await runFaker();
    console.log('✅ Base de datos creada y poblada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando seeder:', error);
    process.exit(1);
  }
}

main();