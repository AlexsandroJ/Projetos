
module CPU
(	input logic clock, reset

				);
//_________________________________Observa��es______________________________________________
// palavras iniciais das variaveis s�o o nome do bloco em que ela � usada separada por '_'  |
// em segida o nome especifico da entrada, o seu objetivo de uso                             |
// exemplo: "bancoRegisters_Instuction" -> Bloco:"bancoRegisters" Uso: "Instuction"          |
// se a primeira letra de Uso estiver em maiusculo, siginifica que � um arrey de linhas     |
// se a primeira letra de Uso estiver em minusculo, siginifica que � um bit                 |
//__________________________________________________________________________________________ |
// saidas e controle regiter PC
wire PC_regwrite;
wire [63:0] PC_DadosOut;
// teste da ferramenta
// modificação 1
// saidas e controle Memoria de instrucao
wire [31:0] Memory_Instruction_DataOut;

// saidas e controle registrador de instrucao
wire Register_Intruction_load_ir;
wire [4:0] Register_Intruction_Instr19_15;
wire [4:0] Register_Intruction_Instr24_20;
wire [4:0] Register_Intruction_Instr11_7;
wire [6:0] Register_Intruction_Instr6_0;
wire [31:0] Register_Intruction_Instr31_0;

// saidas e controle regiter De dados da memoria
wire Register_Memory_regwrite;
wire [63:0] Register_Memory_DadosIn;
wire [63:0] Register_Memory_DadosOut;

// saidas e controle banco de Registradores
wire bancoRegisters_write;
wire [31:0] bancoRegisters_DataOut_1;
wire [31:0] bancoRegisters_DataOut_2;

// saidas e controle registrador A
wire [63:0] A_Out;

// saidas e controle registrador B
wire [63:0] B_Out;

// saidas e controle Mux A
wire [2:0] Mux64_Ula_A_Seletor;
wire [63:0] Mux64_Ula_A_Out;

// saidas e controle Mux B
wire [2:0] Mux64_Ula_B_Seletor;
wire [63:0] Mux64_Ula_B_Out;

// saidas e controle Da ULA
wire [31:0] A;
wire [31:0] B;
wire [31:0] S;
wire [3:0] Seletor;
wire overFlow;
wire negativo;
wire z;
wire igual;
wire maior;
wire menor;

// entradas e saidas Memoria de Dados
wire [63:0] DataMemory_Raddress;
wire [63:0] DataMemory_Waddress;
wire [63:0] DataMemory_DataIn;
wire [63:0] DataMemory_DataOut;
wire DataMemory_wr;
// modificação 2

	register PC( 						.clk(						clock							), 
										.reset(						reset							), 
										.regWrite(					PC_regwrite						), 
										.DadoIn(					Saida							), 
										.DadoOut(					PC_DadosOut						)
																									);

	Memoria32 Memory_Instruction(		.Clk(						clock							), 
										.raddress(					PC_DadosOut						), 
										.waddress(													), 
										.DataIn(													),
										.wr(						0								),
										.DataOut(					Memory_Instruction_DataOut		)
																									);

																					
Instr_Reg_RISC_V Register_Intruction(	.Clk(						clock							), 
										.Reset(						reset							), 
										.Load_ir(													), 
										.Entrada(					Memory_Instruction_DataOut		), 
										.Instr19_15(												), 
										.Instr24_20(												),
										.Instr11_7(													), 
										.Instr6_0(													), 
										.Instr31_0(													)
																									);


								
	bancoReg bancoRegisters( 			.write(						bancoRegisters_write			),
										.clock(						clock							),
										.reset(						reset							),
										.regreader1(				Register_Intruction_Instr19_15	),
									  	.regreader2(				Register_Intruction_Instr24_20	),
									   	.regwriteaddress(			Register_Intruction_Instr11_7	),
									  	.dataout1(													),
									   	.dataout2(													)			
									   																);
	
	register Reg_A( 						.clk(						clock						), 
										.reset(						reset							), 
										.regWrite(					clock							), 
										.DadoIn(					bancoRegisters_DataOut_1		), 
										.DadoOut(					A_Out							)
																									);


	register Reg_B( 						.clk(						clock						), 
										.reset(						reset							), 
										.regWrite(					clock							), 
										.DadoIn(					bancoRegisters_DataOut_2		), 
										.DadoOut(					B_Out							)
																									);
									
	mux64 Mux64_Ula_A(					.Seletor(													),
										.A(							PC_DadosOut						),
										.B(							A_Out							),
										.C(															),
										.D(															)
																									);											  
	
	mux64 Mux64_Ula_B(					.Seletor(													),
										.A(							B_Out							),
										.B(							64'd4							),
										.C(															),
										.D(								)
																		);	
	
	ula64 ULA( 							.A(							Mux64_Ula_A_Out					),
										.B( 						Mux64_Ula_B_Out					), 
										.Seletor(					Seletor							), 
										.S(															), 
										.overFlow(													), 
										.negativo(													), 
										.z(															), 
										.igual(														), 
										.maior(														), 
										.menor(														)
																									);

	register Register_Memory( 			.clk(						clock							), 
										.reset(						reset							), 
										.regWrite(													), 
										.DadoIn(													), 
										.DadoOut(													)
																									);


endmodule

